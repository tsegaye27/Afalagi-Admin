import axios from "axios";

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      axios: axios.create({
        baseURL: "http://localhost:3333/api",
      }),
    },
  };
});
