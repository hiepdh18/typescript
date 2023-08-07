"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DTOMapper = exports.ValueMappingFailedError = exports.MappedDto = exports.MapFrom = exports.getFromFn = exports.SIMPLE_MAPPER_FN = void 0;
/* eslint-disable no-unused-vars */
const _ = __importStar(require("lodash"));
require("reflect-metadata");
const utils_1 = require("../utils/utils");
const symbolFromMap = Symbol('SymbolFromMap');
const SIMPLE_MAPPER_FN = (val) => val;
exports.SIMPLE_MAPPER_FN = SIMPLE_MAPPER_FN;
const getFromFn = (propKey) => (model, prop) => (0, utils_1.deepFind)(model, propKey || prop);
exports.getFromFn = getFromFn;
/* Decorator that maps a property from a source object to a target object using a specified mapper function or class */
function MapFrom(fromProp, mapper, multiple, defaultVal) {
    return (target, propKey) => {
        if (!target.mapperProps) {
            target.mapperProps = {};
        }
        mapper = mapper ? mapper : exports.SIMPLE_MAPPER_FN;
        fromProp = fromProp ? fromProp : propKey;
        const fromFn = _.isFunction(fromProp) ? fromProp : (0, exports.getFromFn)(fromProp);
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
exports.MapFrom = MapFrom;
/* Decorator that creates a new constructor function for a class and adds additional behavior to it */
function MappedDto(target) {
    const original = target;
    // the new constructor behavior
    const func = (...args) => {
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
exports.MappedDto = MappedDto;
class ValueMappingFailedError extends Error {
    constructor(reason) {
        super(`Failed to map value: ${reason}`);
        Error.captureStackTrace(this);
    }
}
exports.ValueMappingFailedError = ValueMappingFailedError;
class DTOMapper {
    constructor(data) {
        // init prop own
        this.doMapping(data);
        Reflect.defineMetadata(symbolFromMap, this.doMapping.bind(this), this);
    }
    /* Checks if a given target is a class */
    isClass(target) {
        return /^\s*class/.test(target.toString());
    }
    /* Takes a value and a mapper function or class, and returns the mapped value using the provided mapper */
    mapValue(value, mapper) {
        try {
            if (this.isClass(mapper)) {
                return new mapper(value);
            }
            else if (_.isFunction(mapper)) {
                return mapper(value);
            }
        }
        catch (err) {
            throw new ValueMappingFailedError(err.message);
        }
    }
    /* Maps multiple values using a provided mapper function or class */
    mapMultipleValue(value, mapper) {
        if (_.isArray(value)) {
            return value.map((val) => this.mapValue(val, mapper));
        }
        else if (_.isObject(value)) {
            return _.mapValues(value, (val) => this.mapValue(val, mapper));
        }
        return this.mapValue(value, mapper);
    }
    /* Retrieving the value from the source object based on the provided `prop` key and applying any necessary mapping using the `mapper` function or class */
    getDataFromSource(source, prop) {
        let preValue;
        try {
            preValue = prop.fromFn(source, prop.propKey);
        }
        catch (ex) {
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
    mappingChild(object, data, prop) {
        const value = this.getDataFromSource(data, object.mapperProps[prop]);
        if (typeof object[prop] !== 'undefined') {
            object[prop].from(value);
        }
    }
    doMapping(data) {
        if (!data)
            return;
        if (this.mapperProps) {
            for (const prop of Object.keys(this.mapperProps)) {
                if (this[prop] instanceof DTOMapper) {
                    // support deep mapping
                    this.mappingChild(this, data, prop);
                    continue;
                }
                const value = this.getDataFromSource(data, this.mapperProps[prop]);
                if (typeof value !== 'undefined') {
                    this[prop] = value;
                }
            }
        }
    }
}
exports.DTOMapper = DTOMapper;
