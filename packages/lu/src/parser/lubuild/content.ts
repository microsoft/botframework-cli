export class Content {
    public ID: string;
    public Path: string;
    public Content: string;
    public Locale: string | undefined;
    public Name: string; // defaults to "<id>.<locale>.lu" for lu files

    constructor(id: string, path: string, content: string, locale?: string, name?: string) {
        this.ID = id;
        this.Path = path;
        this.Content = content;
        this.Locale = locale;
        if (name && name !== '') {
            this.Name = name
        } else {
            if (this.Locale) {
                if (this.Locale !== '') {
                    this.Name = id + '.' + this.Locale + '.lu';
                } else {
                    this.Name = id + '.lu';
                }
            } else {
                this.Name = this.ID;
            }
        }
    }
};