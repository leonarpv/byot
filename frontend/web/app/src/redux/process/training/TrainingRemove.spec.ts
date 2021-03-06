import {TrainingRemove} from './TrainingRemove';
import {Action} from 'typescript-fsa';
import {ProcessActionExtractor} from '@byot-frontend/common/src/redux-system/process/ProcessActionExtractor';
import {GraphQLResponse} from '@byot-frontend/common/src/redux-system/data-structures/responses/GraphQLResponse';
import {AsynchronousActionResponse} from '@byot-frontend/common/src/redux-system/process/ProcessActions';
import {Request, Response} from '@byot-frontend/common/src/redux/process/training/TrainingRemove';
import {WebAppState} from '../../WebAppState';
import {training} from '@byot-frontend/common/test/fixtures/dto/Training';
import {GraphQLError} from 'graphql';
import {ITraining} from '@byot-frontend/common/src/types/interfaces/ITraining';
import {ErrorSnackbar} from '@byot-frontend/web-common/src/types/app/snackbar/ErrorSnackbar';
import {SuccessSnackbar} from '@byot-frontend/web-common/src/types/app/snackbar/SuccessSnackbar';

describe('TrainingRemove process', () => {
  let process: TrainingRemove;
  let request: Action<Request>;
  let response: Action<AsynchronousActionResponse<Request, Response>>;

  beforeEach(() => {
    process = new TrainingRemove();
    request = ProcessActionExtractor.dispatch(TrainingRemove, {id: 'id'});
    response = ProcessActionExtractor.response(request, new GraphQLResponse());
  });

  it('should run valid query', () => {
    const generator = process.saga(request, {} as WebAppState);
    generator.next();
  });

  it('should start loading', () => {
    const state = process.handleRequest(request, {is: {}} as WebAppState, {} as WebAppState);
    expect(state.is.processingTraining).toBeTruthy();
  });

  it('should handle error response', () => {
    response = ProcessActionExtractor.response(
      request,
      new GraphQLResponse<ITraining>(undefined, [new GraphQLError('')])
    );
    const state: WebAppState = process.handleResponse(
      response,
      {is: {}} as WebAppState,
      {} as WebAppState
    ) as WebAppState;
    expect(state.is.processingTraining).toBeFalsy();
    expect(state.snackbar).toEqual(expect.any(ErrorSnackbar));
    expect(state.redirect).toBeUndefined();
  });

  it('should handle successful response', () => {
    response = ProcessActionExtractor.response(request, new GraphQLResponse(training()));
    const state: WebAppState = process.handleResponse(
      response,
      {is: {}} as WebAppState,
      {} as WebAppState
    ) as WebAppState;
    expect(state.is.processingTraining).toBeFalsy();
    expect(state.snackbar).toEqual(expect.any(SuccessSnackbar));
    expect(state.redirect).not.toBeUndefined();
  });

  afterEach(() => jest.clearAllMocks());
});
