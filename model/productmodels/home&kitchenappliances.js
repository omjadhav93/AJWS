const mongoose = require("mongoose");

const WaterFilterSchema = new mongoose.Schema(
  {
    filter_type: { type: String, enum: ["Domestic", "Commercial", "Industrial"], required: true },
    filtration_method: { type: [String], required: true },
    included_components: { type: [String], required: true },
    tank_capacity: { type: Number, required: true },
    filtration_stages: { type: Number, required: true },
  },
  { timestamps: true }
);

const WaterFilterCabinetSchema = new mongoose.Schema(
  {
    tank_full_indicator: { type: String, required: true },
    tank_capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

const WaterFilter = mongoose.model("WaterFilter", WaterFilterSchema);
const WaterFilterCabinet = mongoose.model("WaterFilterCabinet", WaterFilterCabinetSchema);

module.exports = { WaterFilter, WaterFilterCabinet };