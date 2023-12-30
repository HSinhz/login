const  mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Course = new Schema({
        name: { type: String, maxLength: 600, require: true},
        desc: { type: String, maxLength: 600 },
        image: {type: String, maxLength: 600},
        video: { type: String, maxLength: 600 },
        level: {type: String},
        slug: { type: String, slug: ['name', 'level']  }, // unique: không cho thêm trùng slug
    },
    {
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Course', Course); 