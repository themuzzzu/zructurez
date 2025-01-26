import { supabase } from "@/integrations/supabase/client";

export const getOrCreateBookingMessage = async (businessId: string) => {
  // First check if a message template exists
  const { data: existingTemplate, error: templateError } = await supabase
    .from('business_booking_messages')
    .select('message_template')
    .eq('business_id', businessId)
    .maybeSingle();

  if (templateError) throw templateError;

  // If no template exists, create one with default message
  if (!existingTemplate) {
    const defaultTemplate = 'Thank you for booking with us! Your appointment is scheduled for {date} at {time}. Payment amount: ${amount}. Token number: {token}';
    
    const { error: createError } = await supabase
      .from('business_booking_messages')
      .insert({
        business_id: businessId,
        message_template: defaultTemplate
      });

    if (createError) throw createError;

    return defaultTemplate;
  }

  return existingTemplate.message_template;
};

export const formatBookingMessage = (
  template: string,
  date: string,
  time: string,
  cost: number,
  token: string
) => {
  return template
    .replace('{date}', date)
    .replace('{time}', time)
    .replace('{amount}', `${cost}`)
    .replace('{token}', token);
};