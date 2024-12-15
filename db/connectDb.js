const mongoose =require('mongoose')
const local_url = 'mongodb://127.0.0.1:27017/collegeportalproject'
const live_url = 'mongodb+srv://dileepmeena975:YOy8hoEK1SOXHzVO@cluster0.zcooc.mongodb.net/CollegeAddmissionPortalProject'


const connectDb = () =>{

    return mongoose.connect(live_url)

.then(()=>{

    console.log('connect db')

})
.catch((error)=>{

    console.log(error)
})


}

module.exports = connectDb