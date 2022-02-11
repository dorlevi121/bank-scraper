import { ResponseType } from "../models/response.model";

export function responseBuilder(data: any, meta?: any, args?: any){
    const response: ResponseType = {
        data: undefined
    };
    if (meta) {
        // meta['copyright'] = "Beatman LTD.";
        meta['authors'] = ["Dor Levi"];
        response['meta'] = meta;
    }
    response['data'] = data;

    if (args) {
        Object.keys(args).forEach(key => {
            response[key] = args[key]
        })
    }

    return response;
}