/// <reference types="chai" />
import * as request from 'superagent';

// Merge namespace with global chai
declare global {
  namespace Chai {
    interface ChaiStatic {
      request: ChaiHttpRequest;
    }

    interface ChaiHttpRequest {
      (server: any): ChaiHttp.Agent;

      agent(server: any): ChaiHttp.Agent;

      addPromises(promiseConstructor: PromiseConstructorLike): void;
    }

    interface Assertion {
      redirectTo(location: string | RegExp): Assertion;

      param(key: string, value?: string): Assertion;

      cookie(key: string, value?: string): Assertion;

      status(code: number): Assertion;

      statusCode(code: number): Assertion;

      header(key: string, value?: string | RegExp): Assertion;

      headers: Assertion;
      json: Assertion;
      text: Assertion;
      html: Assertion;
      redirect: Assertion;
    }

    interface TypeComparison {
      ip: Assertion;
    }
  }

  namespace ChaiHttp {
    interface Response extends request.Response {}
    interface Agent extends request.SuperAgentStatic {
      keepOpen(): Agent;
      close(callback?: (err: any) => void): Agent;
    }
  }
}
