import { NextRequest, NextResponse } from 'next/server';

// Mock database of blood inventory by hospital
const hospitalBloodInventory = {
  'Memorial Hospital': {
    'A+': { units: 45, demand: 'high' },
    'A-': { units: 12, demand: 'medium' },
    'B+': { units: 23, demand: 'low' },
    'B-': { units: 8, demand: 'high' },
    'AB+': { units: 5, demand: 'low' },
    'AB-': { units: 3, demand: 'critical' },
    'O+': { units: 67, demand: 'medium' },
    'O-': { units: 15, demand: 'critical' },
  },
  'City General Hospital': {
    'A+': { units: 32, demand: 'medium' },
    'A-': { units: 9, demand: 'high' },
    'B+': { units: 18, demand: 'medium' },
    'B-': { units: 5, demand: 'critical' },
    'AB+': { units: 7, demand: 'low' },
    'AB-': { units: 2, demand: 'critical' },
    'O+': { units: 41, demand: 'high' },
    'O-': { units: 11, demand: 'critical' },
  },
  'University Medical Center': {
    'A+': { units: 58, demand: 'low' },
    'A-': { units: 17, demand: 'medium' },
    'B+': { units: 29, demand: 'low' },
    'B-': { units: 10, demand: 'high' },
    'AB+': { units: 12, demand: 'low' },
    'AB-': { units: 4, demand: 'high' },
    'O+': { units: 73, demand: 'medium' },
    'O-': { units: 21, demand: 'high' },
  },
};

// Function to generate AI responses based on user query
function generateResponse(query: string) {
  const queryLower = query.toLowerCase();
  
  // Check for blood type inquiries
  if (queryLower.includes('blood type') || queryLower.includes('blood group')) {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const mentionedType = bloodTypes.find(type => 
      queryLower.includes(type.toLowerCase().replace('+', 'positive').replace('-', 'negative')) ||
      queryLower.includes(type.toLowerCase())
    );
    
    if (mentionedType) {
      // Find hospitals with critical need for this blood type
      const criticalHospitals = Object.entries(hospitalBloodInventory)
        .filter(([_, inventory]) => {
          const bloodTypeInfo = inventory[mentionedType as keyof typeof inventory];
          return bloodTypeInfo && (bloodTypeInfo.demand === 'critical' || bloodTypeInfo.demand === 'high');
        })
        .map(([name, _]) => name);
      
      if (criticalHospitals.length > 0) {
        return `Your blood type ${mentionedType} is currently in high demand at ${criticalHospitals.join(', ')}. Would you like to schedule a donation?`;
      } else {
        return `Your blood type ${mentionedType} is valuable for donation. The current demand is stable, but regular donations are always appreciated.`;
      }
    }
    
    return "What's your blood type? I can tell you about compatibility and current demand.";
  }
  
  // Check for hospital inquiries
  if (queryLower.includes('hospital') || queryLower.includes('center') || queryLower.includes('clinic')) {
    const hospitals = Object.keys(hospitalBloodInventory);
    const mentionedHospital = hospitals.find(hospital => 
      queryLower.includes(hospital.toLowerCase())
    );
    
    if (mentionedHospital) {
      const inventory = hospitalBloodInventory[mentionedHospital as keyof typeof hospitalBloodInventory];
      const criticalTypes = Object.entries(inventory)
        .filter(([_, info]) => info && typeof info === 'object' && 'demand' in info && info.demand === 'critical')
        .map(([type, _]) => type);
      
      if (criticalTypes.length > 0) {
        return `${mentionedHospital} currently has a critical need for blood types ${criticalTypes.join(', ')}. Can you help?`;
      } else {
        return `${mentionedHospital} has a stable blood supply at the moment, but regular donations are always welcome.`;
      }
    }
    
    return "We partner with several hospitals in the area. Which one would you like information about?";
  }
  
  // Check for donation process inquiries
  if (queryLower.includes('donate') || queryLower.includes('donation') || queryLower.includes('process')) {
    return "The donation process is simple and takes about an hour. After registration and a quick health check, the actual donation takes only 8-10 minutes. Would you like to know more about eligibility or schedule a donation?";
  }
  
  // Check for eligibility inquiries
  if (queryLower.includes('eligible') || queryLower.includes('eligibility') || queryLower.includes('can i donate')) {
    return "Eligibility depends on several factors including age (17+), weight (110+ lbs), health status, and time since last donation (56 days for whole blood). Would you like me to check your specific eligibility?";
  }
  
  // Default response
  return "I'm your LifeLink AI assistant. I can help with information about blood donation, eligibility, finding donation centers, or checking blood type compatibility. How can I assist you today?";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Generate AI response based on user query
    const response = generateResponse(message);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}