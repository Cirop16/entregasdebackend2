class BusinessDTO {
    constructor(business) {
        this.name = business.name;
        this.owner = business.owner.email;
        this.location = business.location;
        this.category = business.category;
        this.products = business.products.map(p => p.title);
    }
}

export default BusinessDTO;