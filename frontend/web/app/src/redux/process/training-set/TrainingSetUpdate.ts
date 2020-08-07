import {
  TrainingSetUpdate as TrainingSetUpdateBase,
  Response,
  Request,
} from '@byot-frontend/common/src/redux/process/training-set/TrainingSetUpdate';
import {ProcessActionCreator} from '@byot-frontend/common/src/redux-system/process/ProcessActionCreator';
import {AsynchronousActionResponse} from '@byot-frontend/common/src/redux-system/process/ProcessActions';
import {WebAppState} from '../../WebAppState';
import {Action} from 'typescript-fsa';
import {Router} from '../../../router/Router';

@ProcessActionCreator()
export class TrainingSetUpdate extends TrainingSetUpdateBase {
  handleResponse(
    action: Action<AsynchronousActionResponse<Request, Response>>,
    nextState: Readonly<WebAppState>,
    prevState: Readonly<WebAppState>
  ): Readonly<WebAppState> {
    const state = super.handleResponse(action, nextState, prevState);
    return {
      ...nextState,
      ...state,
      ...(action.payload.response.data && {
        redirect: Router.trainingSet.detail.URI({trainingSetId: action.payload.response.data.id}),
      }),
    };
  }
}
