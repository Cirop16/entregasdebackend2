import businessService from '../services/businessService.js';

export const registerBusiness = async (req, res) => {
    try {
        const newBusiness = await businessService.registerBusiness(req.body);
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar negocio' });
    }
};

export const getBusinessById = async (req, res) => {
    try {
        const business = await businessService.getBusinessById(req.params.bid);
        res.json(business);
    } catch (error) {
        res.status(500).json({ message: 'Negocio no encontrado' });
    }
};