// import {GET} from "bun-fs-router-plugin";
import {GET} from "bun-fs-router-plugin/macros" with { type: 'macro' };


GET((req) => {
  return new Response(["user1", "user2"]);
});
