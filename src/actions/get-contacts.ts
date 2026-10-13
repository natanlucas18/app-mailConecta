'use server';
import { Contact } from "../types/contacts-schema";
import { Params } from "../types/params";
import { PaginatedResponseServerDto } from "../types/response-server.dto";
import { getToken } from "../lib/get-token";

export async function getContacts({ page, limit, search, sortBy, sortOrder }: Params):Promise<PaginatedResponseServerDto<Contact>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search ?? '',
    sortBy,
    sortOrder: sortOrder.toUpperCase(),
  })
  const response = await fetch(`${process.env.API_URL}/contacts?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const data = await response.json();
  return data;
}
