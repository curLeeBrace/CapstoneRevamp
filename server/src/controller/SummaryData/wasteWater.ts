import { Request, Response } from 'express';
import { RequestQueryTypes, prepareQuery} from './mobile_combustion';
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
import getAvailableLocations from '../../../custom_funtions/getAvailableLocations';











const getWasteWaterSummary = async (req : Request, res : Response) => {
    const {brgy_code, form_type, municipality_code, province_code, selectAll, user_type} = req.query as RequestQueryTypes

    const parent_code = user_type === "s-admin" ? province_code : municipality_code
    const locations = getAvailableLocations(parent_code, user_type);

    return res.status(200).send(locations);



}


export default getWasteWaterSummary