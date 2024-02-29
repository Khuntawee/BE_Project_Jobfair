const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    telephone_number: {
        type: String,
        maxlength: [20, 'Telephone number cannot be longer than 20 characters']
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// Reverse populate with virtuals
CompanySchema.virtual('interviews', {
    ref: 'Interview',
    localField: '_id',
    foreignField: 'company',
    justOne: false
});

// Cascade delete interviews when a company is deleted
CompanySchema.pre('deleteOne', {document: true, query: false},  async function(next) {
    console.log(`Interviews being removed from company ${this._id}`);
    await this.model('Interview').deleteMany({company: this._id});
    next();
});

module.exports = mongoose.model('Company', CompanySchema);
    