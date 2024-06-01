import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { checkUrl, getMetadata } from "@/utils/inspect_url";
import { urlInfoM } from "@/models/UrlInfo";
import type { UrlInfoT, UrlInfoFormT } from "@/types/UrlInfo";
import { differenceInDays } from "date-fns";

@Injectable()
export class UrlInfoService {
  constructor() {}

  async inspect(url: string, opt: {validDays?: number} = { validDays: 30 }): Promise<UrlInfoT> {

    url = url.indexOf("://") === -1 ? "http://" + url : url;

    const isUrlValid = checkUrl(url);

    if (!isUrlValid) {
      throw new err.InvalidDataE("invalid url: " + url);
    }

    const cached = await urlInfoM.findOne({ url });

    if (opt.validDays) {
      if (cached && differenceInDays(new Date(), cached.created_at) < opt.validDays) {
        return cached;
      }
    } else {
      if (cached) {
        return cached;
      }
    }

    const { hostname } = new URL(url);


    // optional - you'll need a supabase key if you want caching. highly recommended.

    const metadata = await getMetadata(url);

    if (!metadata) {
      throw new err.InvalidDataE("metadata is invalid with:" + url);
    }
    const { images, og, meta } = metadata!;

    const image = og.image
      ? og.image
      : images.length > 0
        ? images[0].src
        : null;
    const description = og.description
      ? og.description
      : meta.description
        ? meta.description
        : null;
    const title = (og.title ? og.title : meta.title) || "";
    const siteName = og.site_name || "";

    const urlInfoForm: UrlInfoFormT = {
      url,
      title,
      description,
      image,
      sitename: siteName,
      hostname,
    };

    const created = await urlInfoM.upsert(urlInfoForm, { onConflict: ["url"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}