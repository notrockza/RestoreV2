import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { history } from "../..";


axios.defaults.baseURL = "http://localhost:5001/api/";
axios.defaults.withCredentials = true

const ResponseBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise((_) => setTimeout(_, 350));

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    var data = error.response?.data!; //obj ที่ไม่รู้ชนิด
    var json = JSON.stringify(data);
    var result = JSON.parse(json);

    switch (result.status) {
      case 400:
        if (result.errors) {
          const modelStateErrors: string[] = [];
          for (const key in result.errors) {
            if (result.errors[key]) {
              modelStateErrors.push(result.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }

        toast.error(result.title);
        break;
      case 401:
        toast.error(result.title);
        break;
      case 404:
        toast.error(result.title);
        break;
      case 500:
        history.push('/server-error',{state:data})
        toast.error(result.title);
        break;
      default:
        toast.error("เห้ย Error! เช็คสิรอไร");
        break;
    }
  }
);



const requests = {
  get: (url: string) => axios.get(url).then(ResponseBody),
  post: (url: string,body:{}) => axios.post(url,body).then(ResponseBody),
  delete: (url: string) => axios.delete(url).then(ResponseBody),
};

const Catalog = {
  list: () => requests.get("Products"),
  details: (id: number) => requests.get(`products/${id}`),
};

const TestErrors = {
  get400Error: () => requests.get("buggy/GetBadRequest"),
  get401Error: () => requests.get("buggy/GetUnAuthorized"),
  get404Error: () => requests.get("Buggy/GetNotFound"),
  get500Error: () => requests.get("buggy/GetServerError"),
  getValidationError: () => requests.get("buggy/GetValidationError"),
};

const Basket = {
  get :()=> requests.get('basket'),
  addItem: (productId:number,quantity=1)=>requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
  removeItem: (productId:number,quantity=1)=>requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
  Catalog,
  TestErrors,
  Basket
};

export default agent;