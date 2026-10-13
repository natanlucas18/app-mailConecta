'use server';
import { Contact } from "../types/contacts-schema";
import { ResponseServerDto } from "../types/response-server.dto";
import { getToken } from "../lib/get-token";

export async function deleteContact(id: string):Promise<ResponseServerDto<Contact>> {
  const res = await fetch(`${process.env.API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  const response = await res.json();
  return response;
}
