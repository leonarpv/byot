import {
  Login,
  Request as RequestBase,
  Response as ResponseBase,
} from '@byot-frontend/common/src/redux/process/auth/Login';
import {ProcessActionCreator} from '@byot-frontend/common/src/redux-system/process/ProcessActionCreator';
import {GraphQLResponse} from '@byot-frontend/common/src/redux-system/data-structures/responses/GraphQLResponse';
import {IAuth} from '@byot-frontend/common/src/types/interfaces/IAuth';
import {Action} from 'typescript-fsa';
import {call} from 'redux-saga/effects';
import {nativeStorage} from '../../../services/storage/NativeStorage';
import {NativeAppState} from '../../NativeAppState';
import {AsynchronousActionResponse} from '@byot-frontend/common/src/redux-system/process/ProcessActions';
import {AlertOK} from '../../../types/alert/AlertOK';
import {NavigateNoParams} from '../../../types/nav/NavigateNoParams';
import {RuntimeStorage} from '../../../services/storage/RuntimeStorage';

export type Request = RequestBase;
export type Response = ResponseBase;

@ProcessActionCreator()
export class NativeAuth extends Login {
  *saga(action: Action<Request>, state: Readonly<NativeAppState>) {
    const result: GraphQLResponse<IAuth> = yield super.saga(action, state);
    if (result.success) {
      RuntimeStorage.auth = result.data;
      yield call(nativeStorage.setItem, 'auth', result.data);
    }
    return result;
  }

  handleResponse(
    action: Action<AsynchronousActionResponse<Request, Response>>,
    nextState: Readonly<NativeAppState>,
    prevState: Readonly<NativeAppState>
  ): Readonly<NativeAppState> {
    return {
      ...nextState,
      ...(action.payload.response.success
        ? {}
        : {alert: new AlertOK('Error while trying to login, please, check username or password')}),
    };
  }
}
