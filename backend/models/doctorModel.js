import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  feePerConsultation: {
    type: Number,
    required: true,
  },
  timings: {
    type: Array,
    default: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}, {
  timestamps: true,
});

doctorSchema.index({ location: "2dsphere" });

const doctorModel = mongoose.model("doctors", doctorSchema);

export default doctorModel;
