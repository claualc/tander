import languages from "@dict/languages";
import flags from "@dict/flag";

export class Language {

    private name_: string
    private id_?: string
    private flag_?: string | null

    constructor(name: string, id: string) {
        this.name_ = name;
        this.id_ = id;
        this.flag_ = (id) ?
        flags[languages[id].flag_code]
        : null;
    }

    get name() {
        return this.name_;
    }

    get id() {
        return this.id_;
    }

    get flag() {
        return this.flag_;
    }

}
