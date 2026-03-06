import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ValidateOrderSessionParams = {
  tableId: string;
  token: string;
};

export const validateOrderSession = async ({
  tableId,
  token,
}: ValidateOrderSessionParams): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/orders`,
      { tableId: Number(tableId) },
      {
        withCredentials: true,
        headers: {
          token,
          tableid: tableId,
        },
      }
    );

    return response.status === 200;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.status === 501;
    }

    return false;
  }
};
