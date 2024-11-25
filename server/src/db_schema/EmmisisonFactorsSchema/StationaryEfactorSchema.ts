import mongoose from "mongoose";

// Define a reusable schema for emissions
const EmissionsSchema = new mongoose.Schema({
    co2: { type: Number, default: 0 },
    ch4: { type: Number, default: 0 },
    n2o: { type: Number, default: 0 },
});

// Define a reusable default value
const defaultEmissions = { co2: 0, ch4: 0, n2o: 0 };

// Main schema
const StationaryEfactorSchema = new mongoose.Schema({
    cooking: {
        type: {
            charcoal: { type: EmissionsSchema, required: true, default: defaultEmissions },
            diesel: { type: EmissionsSchema, required: true, default: defaultEmissions },
            kerosene: { type: EmissionsSchema, required: true, default: defaultEmissions },
            propane: { type: EmissionsSchema, required: true, default: defaultEmissions },
            wood: { type: EmissionsSchema, required: true, default: defaultEmissions },
        },
        default: {
            charcoal: defaultEmissions,
            diesel: defaultEmissions,
            kerosene: defaultEmissions,
            propane: defaultEmissions,
            wood: defaultEmissions,
        },
    },
    generator: {
        type: {
            motor_gasoline: { type: EmissionsSchema, required: true, default: defaultEmissions },
            kerosene: { type: EmissionsSchema, required: true, default: defaultEmissions },
            diesel: { type: EmissionsSchema, required: true, default: defaultEmissions },
            residual_fuelOil: { type: EmissionsSchema, default: defaultEmissions },
        },
        default: {
            motor_gasoline: defaultEmissions,
            kerosene: defaultEmissions,
            diesel: defaultEmissions,
            residual_fuelOil: defaultEmissions,
        },
    },
    lighting: {
        type: {
            kerosene: { type: EmissionsSchema, required: true, default: defaultEmissions },
        },
        default: {
            kerosene: defaultEmissions,
        },
    },
});

export default mongoose.model("StationaryEfactor", StationaryEfactorSchema);
