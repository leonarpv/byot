import {DateTime} from '../../shared/graphql/ts/types';
import {Moment} from 'moment';

export type IDateTime = DateTime & {moment: Moment};
