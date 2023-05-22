import {AxiosError} from "axios";

interface ErrorData {
  message?: string;
}

const handleAxiosError = (error: Error): string => {
  const err = error as AxiosError<ErrorData>;
  if (err.response) {
    const data = err.response.data;
    if (data && typeof data.message === 'string') {
      if (data.message === "The session ended. Please reconnect") return "return";
      return data.message;
    }
  }
  console.error(error);
  return "An unknown error appeared. Please contact us!";
};

export default handleAxiosError;
