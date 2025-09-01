import json
import os

class SustainabilityScorer:
    def __init__(self):
        self.sustainability_data = self._load_sustainability_data()
    
    def _load_sustainability_data(self):
        """Load sustainability data for different waste categories"""
        return {
            'biodegradable': {
                'score': 8.5,
                'impact': 'Low',
                'tips': [
                    'Compost at home or use municipal composting services',
                    'Use as garden mulch or soil amendment',
                    'Feed to animals if safe (check local regulations)',
                    'Break down naturally in 2-6 months',
                    'Reduces landfill methane emissions'
                ],
                'environmental_benefits': [
                    'Reduces greenhouse gas emissions',
                    'Creates nutrient-rich soil',
                    'Minimizes landfill waste',
                    'Supports circular economy'
                ],
                'decomposition_time': '2-6 months',
                'carbon_footprint': 'Very Low'
            },
            'recyclable': {
                'score': 7.0,
                'impact': 'Medium',
                'tips': [
                    'Clean and sort materials properly',
                    'Check local recycling guidelines',
                    'Rinse containers before recycling',
                    'Remove caps and labels when possible',
                    'Use designated recycling bins'
                ],
                'environmental_benefits': [
                    'Conserves natural resources',
                    'Reduces energy consumption',
                    'Decreases pollution',
                    'Creates new products'
                ],
                'decomposition_time': '100-1000 years',
                'carbon_footprint': 'Low'
            },
            'hazardous': {
                'score': 2.0,
                'impact': 'High',
                'tips': [
                    'Never dispose in regular trash or down drains',
                    'Use designated hazardous waste collection sites',
                    'Contact local waste management authorities',
                    'Store safely until proper disposal',
                    'Follow manufacturer disposal instructions'
                ],
                'environmental_benefits': [
                    'Prevents soil and water contamination',
                    'Protects human and animal health',
                    'Reduces environmental pollution',
                    'Ensures proper treatment'
                ],
                'decomposition_time': 'Never (persistent)',
                'carbon_footprint': 'Very High'
            }
        }
    
    def get_score(self, category):
        """Get sustainability score and information for a category"""
        if category.lower() in self.sustainability_data:
            return self.sustainability_data[category.lower()]
        else:
            # Return default data for unknown categories
            return {
                'score': 5.0,
                'impact': 'Unknown',
                'tips': ['Please consult local waste management guidelines'],
                'environmental_benefits': ['Proper disposal reduces environmental impact'],
                'decomposition_time': 'Unknown',
                'carbon_footprint': 'Unknown'
            }
    
    def calculate_eco_score(self, category, confidence, additional_factors=None):
        """Calculate a comprehensive eco-score based on multiple factors"""
        base_data = self.get_score(category)
        base_score = base_data['score']
        
        # Adjust score based on confidence
        confidence_multiplier = min(confidence, 1.0)
        adjusted_score = base_score * confidence_multiplier
        
        # Apply additional factors if provided
        if additional_factors:
            if 'quantity' in additional_factors:
                # Reduce score for large quantities
                quantity = additional_factors['quantity']
                if quantity > 10:
                    adjusted_score *= 0.8
                elif quantity > 5:
                    adjusted_score *= 0.9
            
            if 'condition' in additional_factors:
                # Adjust score based on item condition
                condition = additional_factors['condition']
                if condition == 'damaged':
                    adjusted_score *= 0.9
                elif condition == 'contaminated':
                    adjusted_score *= 0.7
        
        return min(max(adjusted_score, 0.0), 10.0)
    
    def get_disposal_alternatives(self, category):
        """Get alternative disposal methods for a category"""
        alternatives = {
            'biodegradable': [
                'Home composting',
                'Municipal composting',
                'Garden mulch',
                'Animal feed (if safe)',
                'Natural decomposition'
            ],
            'recyclable': [
                'Curbside recycling',
                'Recycling centers',
                'Upcycling projects',
                'Donation to reuse programs',
                'Manufacturer take-back programs'
            ],
            'hazardous': [
                'Hazardous waste facilities',
                'Special collection events',
                'Manufacturer disposal programs',
                'Professional waste management services',
                'Local government collection programs'
            ]
        }
        
        return alternatives.get(category.lower(), ['Consult local guidelines'])
    
    def get_environmental_impact_breakdown(self, category):
        """Get detailed environmental impact breakdown"""
        impact_data = {
            'biodegradable': {
                'landfill_impact': 'High (methane production)',
                'water_impact': 'Low',
                'air_impact': 'Medium (if not composted)',
                'soil_impact': 'Positive (if composted)',
                'wildlife_impact': 'Low'
            },
            'recyclable': {
                'landfill_impact': 'Medium (space usage)',
                'water_impact': 'Medium (pollution)',
                'air_impact': 'Medium (manufacturing emissions)',
                'soil_impact': 'Low',
                'wildlife_impact': 'Medium (habitat disruption)'
            },
            'hazardous': {
                'landfill_impact': 'Very High (contamination)',
                'water_impact': 'Very High (pollution)',
                'air_impact': 'High (toxic emissions)',
                'soil_impact': 'Very High (contamination)',
                'wildlife_impact': 'Very High (toxicity)'
            }
        }
        
        return impact_data.get(category.lower(), {})
    
    def get_sustainability_tips(self, category):
        """Get sustainability improvement tips for a category"""
        tips = {
            'biodegradable': [
                'Start a home composting system',
                'Use reusable containers instead of disposable ones',
                'Buy products with minimal packaging',
                'Support local farmers markets',
                'Practice zero-waste cooking'
            ],
            'recyclable': [
                'Buy products made from recycled materials',
                'Choose products with recyclable packaging',
                'Reduce consumption of single-use items',
                'Support companies with recycling programs',
                'Educate others about proper recycling'
            ],
            'hazardous': [
                'Choose non-toxic alternatives when possible',
                'Buy only what you need to avoid waste',
                'Use rechargeable batteries',
                'Choose eco-friendly cleaning products',
                'Support hazardous waste collection programs'
            ]
        }
        
        return tips.get(category.lower(), ['Reduce consumption and waste generation'])
    
    def get_category_comparison(self):
        """Get comparison data between all categories"""
        comparison = {}
        
        for category, data in self.sustainability_data.items():
            comparison[category] = {
                'score': data['score'],
                'impact': data['impact'],
                'decomposition_time': data['decomposition_time'],
                'carbon_footprint': data['carbon_footprint']
            }
        
        return comparison
