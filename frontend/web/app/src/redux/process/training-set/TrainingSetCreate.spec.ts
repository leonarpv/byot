import {TrainingSetCreate} from './TrainingSetCreate';
import {Action} from 'typescript-fsa';
import {ProcessActionExtractor} from '@byot-frontend/common/src/redux-system/process/ProcessActionExtractor';
import {GraphQLResponse} from '@byot-frontend/common/src/redux-system/data-structures/responses/GraphQLResponse';
import {AsynchronousActionResponse} from '@byot-frontend/common/src/redux-system/process/ProcessActions';
import {Request, Response} from '@byot-frontend/common/src/redux/process/training-set/TrainingSetCreate';
import {WebAppState} from '../../WebAppState';
import {trainingSet} from '@byot-frontend/common/test/fixtures/dto/TrainingSet';
import {GraphQLError} from 'graphql';
import {ITrainingSet} from '@byot-frontend/common/src/types/interfaces/ITrainingSet';
import {SuccessSnackbar} from '@byot-frontend/web-common/src/types/app/snackbar/SuccessSnackbar';
import {ErrorSnackbar} from '@byot-frontend/web-common/src/types/app/snackbar/ErrorSnackbar';

describe('TrainingSetCreate process', () => {
  let process: TrainingSetCreate;
  let request: Action<Request>;
  let response: Action<AsynchronousActionResponse<Request, Response>>;

  beforeEach(() => {
    process = new TrainingSetCreate();
    request = ProcessActionExtractor.dispatch(TrainingSetCreate, trainingSet());
    response = ProcessActionExtractor.response(request, new GraphQLResponse());
  });

  it('should run valid query', () => {
    const generator = process.saga(request, {} as WebAppState);
    generator.next();
  });

  it('should start loading', () => {
    const state = process.handleRequest(request, {is: {}} as WebAppState, {} as WebAppState);
    expect(state.is.processingTrainingSet).toBeTruthy();
  });

  it('should handle error response', () => {
    response = ProcessActionExtractor.response(
      request,
      new GraphQLResponse<ITrainingSet>(undefined, [new GraphQLError('')])
    );
    const state: WebAppState = process.handleResponse(
      response,
      {is: {}} as WebAppState,
      {} as WebAppState
    ) as WebAppState;
    expect(state.is.processingTrainingSet).toBeFalsy();
    expect(state.snackbar).toEqual(expect.any(ErrorSnackbar));
    expect(state.redirect).toBeUndefined();
  });

  it('should handle successful response', () => {
    response = ProcessActionExtractor.response(request, new GraphQLResponse(trainingSet()));
    const state: WebAppState = process.handleResponse(
      response,
      {is: {}} as WebAppState,
      {} as WebAppState
    ) as WebAppState;
    expect(state.is.processingTrainingSet).toBeFalsy();
    expect(state.snackbar).toEqual(expect.any(SuccessSnackbar));
    expect(state.redirect).not.toBeUndefined();
  });

  afterEach(() => jest.clearAllMocks());
});
