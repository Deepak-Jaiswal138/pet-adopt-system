import { Request, Response } from 'express';
import Pet from '../models/petModel';

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
export const getPets = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword as string, $options: 'i' } },
                    { breed: { $regex: req.query.keyword as string, $options: 'i' } },
                ],
            }
            : {};

        const pets = await Pet.find({ ...keyword });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req: Request, res: Response) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            res.json(pet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Admin
export const createPet = async (req: Request, res: Response) => {
    const { name, species, breed, age, description, imageUrl } = req.body;

    try {
        const pet = new Pet({
            name,
            species,
            breed,
            age,
            description,
            imageUrl,
        });

        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
export const updatePet = async (req: Request, res: Response) => {
    const { name, species, breed, age, description, imageUrl, adopted } = req.body;

    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            pet.name = name || pet.name;
            pet.species = species || pet.species;
            pet.breed = breed || pet.breed;
            pet.age = age || pet.age;
            pet.description = description || pet.description;
            pet.imageUrl = imageUrl || pet.imageUrl;
            pet.adopted = adopted !== undefined ? adopted : pet.adopted;

            const updatedPet = await pet.save();
            res.json(updatedPet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
export const deletePet = async (req: Request, res: Response) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet) {
            await pet.deleteOne();
            res.json({ message: 'Pet removed' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
