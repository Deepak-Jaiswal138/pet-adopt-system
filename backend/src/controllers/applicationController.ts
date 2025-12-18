import { Request, Response } from 'express';
import Application from '../models/applicationModel';
import Pet from '../models/petModel';

// @desc    Apply for a pet
// @route   POST /api/applications
// @access  Private
export const applyForPet = async (req: Request | any, res: Response) => {
    const { petId, message } = req.body;

    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            res.status(404).json({ message: 'Pet not found' });
            return;
        }

        const alreadyApplied = await Application.findOne({
            user: req.user._id,
            pet: petId,
        });

        if (alreadyApplied) {
            res.status(400).json({ message: 'You have already applied for this pet' });
            return;
        }

        const application = await Application.create({
            user: req.user._id,
            pet: petId,
            message,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user applications
// @route   GET /api/applications/my
// @access  Private
export const getMyApplications = async (req: Request | any, res: Response) => {
    try {
        const applications = await Application.find({ user: req.user._id }).populate('pet');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({}).populate('pet').populate('user', 'name email');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = async (req: Request, res: Response) => {
    const { status } = req.body;

    try {
        const application: any = await Application.findById(req.params.id);

        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        application.status = status;
        await application.save();

        // If approved, mark pet as adopted
        if (status === 'Approved') {
            const pet: any = await Pet.findById(application.pet);
            if (pet) {
                pet.adopted = true;
                await pet.save();
            }
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
