'use server';
import { Contact, ContactForm } from "../types/contacts-schema";
import { ResponseServerDto } from "../types/response-server.dto";
import { getToken } from "../lib/get-token";

export async function createContact(contactForm:ContactForm):Promise<ResponseServerDto<Contact>> {
    const response = await fetch(`${process.env.API_URL}/contacts`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${await getToken()}`
        },
        body: JSON.stringify(contactForm)
    });

    const responseData = await response.json();
    return responseData;
}