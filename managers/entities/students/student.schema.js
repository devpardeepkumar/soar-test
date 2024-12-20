

module.exports = {
    createStudents: [
        {
            model: 'schoolid',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model: 'name',
            required: true,
        },
    ],
    selectStudents: [
        {
            model: 'id',
            required: true,
        }
    ],
}


