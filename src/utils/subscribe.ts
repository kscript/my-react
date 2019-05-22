interface Lisenter {
    (data: any): void;
    gid?: number;
}

class Subscribe {
    private gid: number = 1;

    private bus: {
        [propName: string]: Lisenter[];
    } = {};

    private onces: {
        [propName: string]: number;
    } = {};

    public on(name: string, lisenter: Lisenter) {
        if (!lisenter.gid) {
            lisenter.gid = this.gid++;
        }
        this.bus[name] = this.bus[name] || [];
        this.bus[name].push(lisenter);
    }
    public off(name: string, lisenter: Lisenter) {
        if (this.bus[name]) {
            this.bus[name] = this.bus[name].filter((item) => {
                return lisenter && item ? item.gid === lisenter.gid : false;
            });
        }
    }
    public once(name: string, lisenter: Lisenter) {
        if (!this.onces[name]) {
            this.bus[name] = [lisenter];
            this.onces[name] = 1;
        }
    }
    public emit(name: string, data: any) {
        if (this.bus[name]) {
            this.bus[name].forEach((item) => {
                item(data);
            });
        }
    }
    // private name(name: string) {
    //     return 'on:' + name;
    // }
}
export default Subscribe;
