const PRIORITIES = {

    header: 100,

    addresses: 95,

    recipient: 95,

    items: 50,

    totals: 90,

    payment: 90,

    signature: 90,

    footer: 80,

    notes: 70,

    terms: 70,

    qr: 60,

    history: 60

};

class SectionPriority {

    get(type) {

        return PRIORITIES[type] ?? 50;

    }

}

export default new SectionPriority();