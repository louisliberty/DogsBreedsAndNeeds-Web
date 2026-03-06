import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Dog, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Breed } from "@shared/schema";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: "living",
    text: "What is your living situation?",
    options: [
      { label: "Apartment or condo", value: "apartment" },
      { label: "House with small yard", value: "small-yard" },
      { label: "House with large yard", value: "large-yard" },
      { label: "Rural property", value: "rural" },
    ],
  },
  {
    id: "activity",
    text: "How active is your lifestyle?",
    options: [
      { label: "Mostly sedentary — I prefer relaxing at home", value: "low" },
      { label: "Moderately active — daily walks and some outdoor time", value: "moderate" },
      { label: "Very active — I run, hike, or exercise regularly", value: "high" },
      { label: "Extremely active — I want a workout partner", value: "very-high" },
    ],
  },
  {
    id: "size",
    text: "What size dog do you prefer?",
    options: [
      { label: "Small (under 25 lbs)", value: "Small" },
      { label: "Medium (25-60 lbs)", value: "Medium" },
      { label: "Large (60-100 lbs)", value: "Large" },
      { label: "Giant (100+ lbs)", value: "Giant" },
      { label: "No preference", value: "any" },
    ],
  },
  {
    id: "kids",
    text: "Do you have children at home?",
    options: [
      { label: "Yes, young children (under 6)", value: "young" },
      { label: "Yes, older children (6-12)", value: "older" },
      { label: "Teenagers", value: "teens" },
      { label: "No children", value: "none" },
    ],
  },
  {
    id: "experience",
    text: "How experienced are you with dogs?",
    options: [
      { label: "First-time dog owner", value: "beginner" },
      { label: "Some experience with dogs", value: "intermediate" },
      { label: "Very experienced dog owner", value: "advanced" },
    ],
  },
  {
    id: "grooming",
    text: "How much time can you spend on grooming?",
    options: [
      { label: "Minimal — low-maintenance preferred", value: "low" },
      { label: "Weekly brushing is fine", value: "moderate" },
      { label: "I don't mind daily grooming", value: "high" },
    ],
  },
  {
    id: "shedding",
    text: "How do you feel about shedding?",
    options: [
      { label: "I need a low-shedding or hypoallergenic breed", value: "low" },
      { label: "Some shedding is okay", value: "moderate" },
      { label: "Shedding doesn't bother me", value: "any" },
    ],
  },
];

function scoreBreed(breed: Breed, answers: Record<string, string>): number {
  let score = 0;

  if (answers.living === "apartment" && breed.apartmentSuitable) score += 3;
  if (answers.living === "apartment" && !breed.apartmentSuitable) score -= 3;
  if (answers.living === "rural") score += 1;

  const energyMap: Record<string, string[]> = {
    low: ["Low"],
    moderate: ["Low", "Moderate"],
    high: ["Moderate", "High"],
    "very-high": ["High", "Very High"],
  };
  if (answers.activity && energyMap[answers.activity]?.includes(breed.energyLevel)) score += 3;

  if (answers.size && answers.size !== "any" && breed.sizeCategory === answers.size) score += 3;

  if (answers.kids === "young" && breed.goodWithKids >= 4) score += 3;
  if (answers.kids === "young" && breed.goodWithKids <= 2) score -= 3;
  if (answers.kids === "older" && breed.goodWithKids >= 3) score += 2;

  if (answers.experience === "beginner" && breed.trainability === "Easy") score += 3;
  if (answers.experience === "beginner" && breed.trainability === "Independent") score -= 3;
  if (answers.experience === "advanced") score += 1;

  if (answers.grooming === "low" && ["Low", "Moderate"].includes(breed.sheddingLevel)) score += 1;

  if (answers.shedding === "low" && breed.hypoallergenic) score += 3;
  if (answers.shedding === "low" && ["High", "Very High"].includes(breed.sheddingLevel)) score -= 3;

  return score;
}

export default function Quiz() {
  useCanonical("/dog-breed-selector");
  usePageMeta(
    "Dog Breed Selector Quiz: Find Your Perfect Breed | Dog Breeds & Needs",
    "Not sure which dog breed is right for you? Take our free 7-question breed selector quiz and get personalized matches based on your lifestyle. Start now!"
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const { data: breeds } = useQuery<Breed[]>({
    queryKey: ["/api/breeds"],
  });

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const results = showResults && breeds
    ? breeds
        .map((b) => ({ breed: b, score: scoreBreed(b, answers) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    : [];

  const reset = () => {
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" data-testid="text-quiz-results-title">Your Top Breed Matches</h2>
            <p className="text-muted-foreground">Based on your answers, here are the best breeds for you</p>
          </div>

          <div className="space-y-4">
            {results.map(({ breed, score }, index) => (
              <Link key={breed.id} href={`/breeds/${breed.slug}`}>
                <Card className="cursor-pointer hover:border-primary transition-colors" data-testid={`card-quiz-result-${index}`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="text-2xl font-bold text-primary w-10 text-center shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{breed.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                        <Badge variant="outline" className="text-xs">{breed.breedGroup}</Badge>
                        <Badge variant="outline" className="text-xs">{breed.sizeCategory}</Badge>
                        <Badge variant="outline" className="text-xs">{breed.energyLevel} Energy</Badge>
                        {breed.hypoallergenic && <Badge variant="secondary" className="text-xs">Hypoallergenic</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{breed.temperamentSummary}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button onClick={reset} variant="outline" data-testid="button-retake-quiz">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Dog className="h-12 w-12 mx-auto text-primary mb-3" />
          <h1 className="text-3xl font-bold mb-2" data-testid="text-quiz-title">Dog Breed Selector Quiz</h1>
          <p className="text-muted-foreground">Answer {questions.length} quick questions to find your ideal match</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl" data-testid="text-quiz-question">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option) => (
              <Button
                key={option.value}
                variant={answers[question.id] === option.value ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleAnswer(question.id, option.value)}
                data-testid={`button-quiz-option-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {currentQ > 0 && (
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setCurrentQ(currentQ - 1)}
            data-testid="button-quiz-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Question
          </Button>
        )}
      </div>
    </div>
  );
}
