/* eslint-disable no-unused-vars */
import * as _ from 'lodash';
import 'reflect-metadata';
import { deepFind } from '../utils/utils';

const symbolFromMap = Symbol('SymbolFromMap'); 

export const SIMPLE_MAPPER_FN: MapperFunction = (val) => val;

export const getFromFn =
  (propKey: string) => (model: any, prop: string) =>
    deepFind(model, propKey || prop); 

/* Map a value from the `data` object based on the provided `prop` key. */
export type MapperFunction<A = any, B = any> = (data: A, prop: string) => B;

/* A type declaration for a constructor of a class. It represents a function that can be used to create new instances of a class. */
export type MapperClass = new (...args: any[]) => any;

export type IDtoMapper<T = any> = new (source: T) => IDtoMapper<T>;

export interface MapperProp {
  mapper: MapperFunction | MapperClass;
  fromFn: MapperFunction;
  propKey: string;
  multiple: boolean;
  defaultVal?: any;
}

export interface MapperProps {
  [key: string]: MapperProp;
}

/* Decorator that maps a property from a source object to a target object using a specified mapper function or class */
export function MapFrom(
  fromProp?: string | MapperFunction,
  mapper?: MapperFunction | MapperClass,
  multiple?: boolean,
  defaultVal?: any,
) {
  return (target: DTOMapper, propKey: string) => {
    if (!target.mapperProps) {
      target.mapperProps = {};
    }
    mapper = mapper ? mapper : SIMPLE_MAPPER_FN;
    fromProp = fromProp ? fromProp : propKey;
    const fromFn = _.isFunction(fromProp) ? fromProp : getFromFn(fromProp);
    multiple = multiple ? true : false;
    target.mapperProps[propKey] = {
      mapper,
      fromFn,
      propKey,
      multiple,
      defaultVal,
    };
  };
}

/* Decorator that creates a new constructor function for a class and adds additional behavior to it */
export function MappedDto(target: MapperClass) {
  const original = target;

  // the new constructor behavior
  const func: any = (...args: any[]) => {
    const instance = new original(args);
    if (instance.mapperProps) {
      const mapper = new DTOMapper();
      mapper.mapperProps = instance.mapperProps;
      const __from__ = Reflect.getMetadata(symbolFromMap, mapper);
      __from__(args[0]);
      Object.assign(instance, mapper);
      delete instance.mapperProps;
    }
    return instance;
  };

  // copy prototype so instance of operator still works
  func.prototype = original.prototype;

  // return new constructor (will override original)
  return func;
}

export class ValueMappingFailedError extends Error {
  constructor(reason: string) {
    super(`Failed to map value: ${reason}`);
    Error.captureStackTrace(this);
  }
}

export class DTOMapper<DTOAttributes = any> {
  public mapperProps: MapperProps | undefined;

  constructor(data?: DTOAttributes) {
    // init prop own
    this.doMapping(data);
    Reflect.defineMetadata(symbolFromMap, this.doMapping.bind(this), this);
  }

  /* Checks if a given target is a class */
  private isClass(target: any): boolean {
    return /^\s*class/.test(target.toString());
  }

  /* Takes a value and a mapper function or class, and returns the mapped value using the provided mapper */
  private mapValue(value: any, mapper: MapperFunction | MapperClass): any {
    try {
      if (this.isClass(mapper)) {
        return new (mapper as MapperClass)(value);
      } else if (_.isFunction(mapper)) {
        return (mapper as Function)(value);
      }
    } catch (err: any) {
      throw new ValueMappingFailedError(err.message);
    }
  }

  /* Maps multiple values using a provided mapper function or class */
  private mapMultipleValue(value: any, mapper: MapperFunction | MapperClass): any {
    if (_.isArray(value)) {
      return value.map((val) => this.mapValue(val, mapper));
    } else if (_.isObject(value)) {
      return _.mapValues(value, (val) => this.mapValue(val, mapper));
    }
    return this.mapValue(value, mapper);
  }

  /* Retrieving the value from the source object based on the provided `prop` key and applying any necessary mapping using the `mapper` function or class */
  private getDataFromSource(source: any, prop: MapperProp): any {
    let preValue: any;

    try {
      preValue = prop.fromFn(source, prop.propKey);
    } catch (ex) {
      console.log('ERROR MAPPING ATTR', ex);
    }

    const rawValue = !_.isUndefined(preValue) ? preValue : prop.defaultVal;

    if (_.isObject(rawValue) && _.isEmpty(rawValue) && prop.multiple) {
      return rawValue;
    }

    const value = prop.multiple
      ? this.mapMultipleValue(rawValue, prop.mapper)
      : this.mapValue(rawValue, prop.mapper);
    // if (typeof value === 'undefined') {
    //   return value;
    // }

    return value;
  }

  /* Takes an object, data, and a property name as parameters, and assigns a value to the property of the object if it exists */
  private mappingChild(object: any, data: any, prop: string): any {
    const value = this.getDataFromSource(data, object.mapperProps[prop]);
    if (typeof object[prop] !== 'undefined') {
      object[prop].from(value);
    }
  }

  protected doMapping(data: any): any {
    if (!data) return;

    if (this.mapperProps) {
      for (const prop of Object.keys(this.mapperProps)) {
        if (this[prop as keyof DTOMapper] instanceof DTOMapper) {
          // support deep mapping
          this.mappingChild(this, data, prop);
          continue;
        }
        const value = this.getDataFromSource(data, this.mapperProps[prop]);
        if (typeof value !== 'undefined') {
          this[prop as keyof DTOMapper] = value;
        }
      }
    }
  }
}
