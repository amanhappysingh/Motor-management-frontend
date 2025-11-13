import api from "./api";

type MethodsArgs = {
  url: string;
  data?: any;
  params?: any;
  contentType?: string; // <-- custom content type
};

// global error handler
const handleError = (error: any) => {
  throw error?.response?.data?.message || error?.message || "Something went wrong";
};

export const Api = {
  get:
    async ({ url, params }: MethodsArgs) => {
      try {
        const res = await api.get(url, { params });
        return res ;
      } catch (error) {
        handleError(error);
      }
    },

  post:
   async ({ url, data, contentType = "application/json" }: MethodsArgs) =>  {
      try {
        const res = await api.post(url, data, {
          headers: { "Content-Type": contentType },
        });
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

  put:
    async ({ url, data, contentType = "application/json" }: MethodsArgs) => {
      try {
        const res = await api.put(url, data, {
          headers: { "Content-Type": contentType },
        });
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
  patch:
    async ({ url, data, contentType = "application/json" }: MethodsArgs) => {
      try {
        const res = await api.patch(url, data, {
          headers: { "Content-Type": contentType },
        });
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },

  delete:
    async ({ url, params }: MethodsArgs)  => {
      try {
        const res = await api.delete(url, { params });
        return res.data;
      } catch (error) {
        handleError(error);
      }
    },
};
