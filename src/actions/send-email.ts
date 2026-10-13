'use server';
import { SendEmailPayload } from "../types/send-email-schema";
import { ResponseServerDto } from "../types/response-server.dto";
import { getToken } from "../lib/get-token";

export async function sendEmail(data: SendEmailPayload):Promise<ResponseServerDto<void>> {
  const response = await fetch(`${process.env.API_URL}/email/send`, {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${await getToken()}`
    },
    body: JSON.stringify(data),
  })
  const responseData = await response.json();
  return responseData;
}
