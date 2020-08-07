import {TrainingBaseFetch, Request, Response} from './TrainingBaseFetch';
import {Action} from 'typescript-fsa';
import {ProcessActionExtractor} from '@byot-frontend/common/src/redux-system/process/ProcessActionExtractor';
import {GraphQLResponse} from '@byot-frontend/common/src/redux-system/data-structures/responses/GraphQLResponse';
import {AsynchronousActionResponse} from '@byot-frontend/common/src/redux-system/process/ProcessActions';
import {DataResponse} from '@byot-frontend/common/src/redux-system/data-structures/responses/DataResponse';
import {FrontendCommonState} from '../../FrontendCommonState';

describe('TrainingBaseFetch process', () => {
  let process: TrainingBaseFetch;
  let request: Action<Request>;
  let response: Action<AsynchronousActionResponse<Request, DataResponse<Response>>>;

  beforeEach(() => {
    process = new TrainingBaseFetch();
    request = ProcessActionExtractor.dispatch(TrainingBaseFetch, {id: 'id'});
    response = ProcessActionExtractor.response(request, new GraphQLResponse());
  });

  it('should run valid query', () => {
    const generator = process.saga(request, {} as FrontendCommonState);
    generator.next();
  });

  afterEach(() => jest.clearAllMocks());
});
