import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import petData from '../data/pets.json';

const PetSelection = ({ onPetSelected }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState('');
  const [showNaming, setShowNaming] = useState(false);

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    setShowNaming(true);
  };

  const handleConfirmPet = () => {
    if (petName.trim()) {
      onPetSelected({
        petType: selectedPet.id,
        petName: petName.trim(),
        petLevel: 0,
        petExperience: 0,
        petHappiness: 100,
        petEnergy: 100,
        lastFed: Date.now(),
        lastPlayed: Date.now()
      });
    }
  };

  const getPetEmoji = (pet, level = 0) => {
    if (level === 0) return pet.levels["0"].emoji;
    if (level >= 1 && level <= 3) return pet.levels["1-3"].emoji;
    if (level >= 4 && level <= 6) return pet.levels["4-6"].emoji;
    if (level >= 7 && level <= 9) return pet.levels["7-9"].emoji;
    return pet.levels["10+"].emoji;
  };

  if (showNaming) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-96 max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Name Your Pet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">{getPetEmoji(selectedPet)}</div>
              <div className="text-lg font-semibold">{selectedPet.name}</div>
              <div className="text-sm text-gray-600">{selectedPet.description}</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petName">Pet Name</Label>
              <Input
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter your pet's name..."
                maxLength={20}
                autoFocus
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNaming(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmPet}
                disabled={!petName.trim()}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Choose Your Pet Companion</CardTitle>
          <p className="text-center text-gray-600">Select a pet to accompany you on your learning journey!</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petData.pets.map((pet) => (
              <Card 
                key={pet.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => handlePetSelect(pet)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{getPetEmoji(pet)}</div>
                  <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{pet.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div><strong>Personality:</strong> {pet.personality}</div>
                    <div><strong>Favorite Food:</strong> {pet.favoriteFood}</div>
                    <div><strong>Favorite Activity:</strong> {pet.favoriteActivity}</div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    <div>Level 0: {pet.levels["0"].name}</div>
                    <div>Level 1-3: {pet.levels["1-3"].name}</div>
                    <div>Level 4-6: {pet.levels["4-6"].name}</div>
                    <div>Level 7-9: {pet.levels["7-9"].name}</div>
                    <div>Level 10+: {pet.levels["10+"].name}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetSelection; 