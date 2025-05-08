
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateAbout,
} from "@/utils/validation";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  lang: string;
  about: string;
}

const CandidateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    lang: "",
    about: "",
  });

  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string | null>>({
    name: null,
    email: null,
    phoneNumber: null,
    password: null,
    lang: null,
    about: null,
  });

  useEffect(() => {
    validateForm();
  }, [formData, showPhone]);

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phoneNumber: validatePhone(formData.phoneNumber, false),
      password: validatePassword(formData.password),
      lang: formData.lang ? null : "Please select a language",
      about: validateAbout(formData.about),
    };

    setErrors(newErrors);
    setIsFormValid(
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.lang &&
      !newErrors.about &&
      (showPhone ? !newErrors.phoneNumber : true)
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, lang: value });
  };

  const handlePhoneToggle = () => {
    setShowPhone(!showPhone);
    if (!showPhone) {
      setFormData({ ...formData, phoneNumber: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    // Prepare submission data
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
      lang: formData.lang,
      about: formData.about,
    };
    
    console.log("Form submission data:", submissionData);
    
    try {
      const response = await fetch("https://admin-staging.whydonate.dev/whydonate/assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        toast.success("Form submitted successfully!");
        // Optional: Reset the form
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          lang: "",
          about: "",
        });
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="form-container">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Candidate Application</h1>
        
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
        </div>
        
        {/* Phone Number Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showPhone">Include Phone Number</Label>
          <Switch
            id="showPhone"
            checked={showPhone}
            onCheckedChange={handlePhoneToggle}
          />
        </div>
        
        {/* Conditionally Rendered Phone Number Field */}
        {showPhone && (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="10-digit number"
              className={errors.phoneNumber ? "border-destructive" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-destructive text-sm">{errors.phoneNumber}</p>
            )}
          </div>
        )}
        
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm">{errors.password}</p>
          )}
        </div>
        
        {/* Language Selector */}
        <div className="space-y-2">
          <Label htmlFor="lang">
            Language <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={handleSelectChange}
            value={formData.lang}
          >
            <SelectTrigger id="lang" className={errors.lang ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your preferred language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (en)</SelectItem>
              <SelectItem value="fr">French (fr)</SelectItem>
              <SelectItem value="nl">Dutch (nl)</SelectItem>
              <SelectItem value="it">Italian (it)</SelectItem>
              <SelectItem value="de">German (de)</SelectItem>
            </SelectContent>
          </Select>
          {errors.lang && <p className="text-destructive text-sm">{errors.lang}</p>}
        </div>
        
        {/* About Yourself */}
        <div className="space-y-2">
          <Label htmlFor="about">
            About Yourself <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Tell us about yourself (minimum 50, maximum 500 characters)"
            rows={5}
            className={errors.about ? "border-destructive" : ""}
          />
          <div className={`character-counter ${formData.about.length < 50 || formData.about.length > 500 ? "error" : ""}`}>
            {formData.about.length}/500 characters
            {formData.about.length < 50 && ` (${50 - formData.about.length} more required)`}
          </div>
          {errors.about && <p className="text-destructive text-sm">{errors.about}</p>}
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Card>
  );
};

export default CandidateForm;
