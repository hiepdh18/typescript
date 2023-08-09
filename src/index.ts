import { BackendLogger } from './common/logger/backend.logger';
import chalk from 'chalk';
console.log('Hello world!');

const x = new BackendLogger('f');
x.log('logging');
x.error('erro', 'f');
x.warn('errosdfas');
const a = 1;

