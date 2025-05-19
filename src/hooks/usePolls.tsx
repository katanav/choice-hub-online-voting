import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import * as crypto from 'crypto';

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  is_multiple_choice: boolean;
  is_private: boolean;
  end_date: string;
  created_at: string;
  created_by: string;
  options: PollOption[];
}

// Function to hash passwords securely
const hashPassword = (password: string): string => {
  // Using SHA-256 for hashing
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const usePolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchPolls = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .order('end_date', { ascending: true }); // Sort by end_date ascending (soonest first)
      
      if (pollsError) throw pollsError;

      // Fetch options for all polls
      const pollIds = pollsData.map(poll => poll.id);
      const { data: optionsData, error: optionsError } = await supabase
        .from('poll_options')
        .select('id, poll_id, text')
        .in('poll_id', pollIds);
        
      if (optionsError) throw optionsError;

      // Fetch vote counts
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('poll_option_id, poll_id')
        .in('poll_id', pollIds);

      if (votesError) throw votesError;
        
      // Process and combine the data
      const pollsWithOptions = pollsData.map(poll => {
        const options = optionsData
          .filter(option => option.poll_id === poll.id)
          .map(option => {
            const voteCount = votesData.filter(vote => vote.poll_option_id === option.id).length;
            return {
              id: option.id,
              text: option.text,
              votes: voteCount
            };
          });
          
        return {
          ...poll,
          options
        };
      });
      
      setPolls(pollsWithOptions);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Error fetching polls",
        description: "There was a problem retrieving the polls. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async (
    title: string, 
    description: string, 
    options: string[], 
    endDate: string, 
    isMultipleChoice: boolean,
    isPrivate: boolean = false,
    password: string | null = null
  ) => {
    if (!user) return null;
    
    try {
      // Validate that the end date is in the future
      const endDateObj = new Date(endDate);
      const now = new Date();
      
      if (isNaN(endDateObj.getTime())) {
        toast({
          title: "Invalid end date",
          description: "Please provide a valid end date.",
          variant: "destructive"
        });
        return null;
      }
      
      if (endDateObj <= now) {
        toast({
          title: "Invalid end date",
          description: "The end date must be in the future.",
          variant: "destructive"
        });
        return null;
      }
      
      // Hash the password if provided for private polls
      const hashedPassword = isPrivate && password ? hashPassword(password) : null;
      
      // Insert the poll
      const { data: newPoll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title,
          description,
          end_date: endDate,
          is_multiple_choice: isMultipleChoice,
          is_private: isPrivate,
          password: hashedPassword,
          created_by: user.id
        })
        .select()
        .single();
        
      if (pollError) throw pollError;
      
      // Insert the options
      const optionsToInsert = options.map(text => ({
        poll_id: newPoll.id,
        text
      }));
      
      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);
        
      if (optionsError) throw optionsError;
      
      // Refetch polls to update the list
      await fetchPolls();
      
      return newPoll.id;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "Error creating poll",
        description: "There was a problem creating your poll. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Filter polls by date range
  const filterPollsByDateRange = (
    polls: Poll[],
    startDate?: Date | null,
    endDate?: Date | null,
    filterYear?: number | null,
    filterMonth?: number | null,
    filterDay?: number | null
  ) => {
    return polls.filter(poll => {
      const pollDate = new Date(poll.end_date);
      
      // Apply date range filter if provided
      if (startDate && pollDate < startDate) return false;
      if (endDate && pollDate > endDate) return false;
      
      // Apply year filter if provided
      if (filterYear !== null && filterYear !== undefined) {
        if (pollDate.getFullYear() !== filterYear) return false;
      }
      
      // Apply month filter if provided
      if (filterMonth !== null && filterMonth !== undefined) {
        if (pollDate.getMonth() !== filterMonth) return false;
      }
      
      // Apply day filter if provided
      if (filterDay !== null && filterDay !== undefined) {
        if (pollDate.getDate() !== filterDay) return false;
      }
      
      return true;
    });
  };

  const checkPollPassword = async (pollId: string, password: string) => {
    try {
      // Hash the password attempt before checking
      const hashedAttempt = hashPassword(password);
      
      const { data, error } = await supabase
        .rpc('check_poll_password', { 
          poll_id: pollId, 
          password_attempt: hashedAttempt 
        });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error checking poll password:', error);
      return false;
    }
  };

  const submitVote = async (pollId: string, optionIds: string[]) => {
    if (!user) return false;
    
    try {
      // Prepare votes to insert
      const votesToInsert = optionIds.map(optionId => ({
        poll_id: pollId,
        poll_option_id: optionId,
        voter_id: user.id
      }));
      
      const { error } = await supabase
        .from('votes')
        .insert(votesToInsert);
        
      if (error) throw error;
      
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded successfully.",
      });
      
      await fetchPolls();
      return true;
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      
      // Check if it's a duplicate vote error
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Already voted",
          description: "You have already voted on this poll.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error submitting vote",
          description: "There was a problem recording your vote. Please try again.",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const hasVoted = async (pollId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('voter_id', user.id)
        .limit(1);
        
      if (error) throw error;
      
      return data.length > 0;
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  const isPollPrivate = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    return poll?.is_private || false;
  };

  useEffect(() => {
    if (user) {
      fetchPolls();
    }
  }, [user]);

  return {
    polls,
    loading,
    createPoll,
    fetchPolls,
    submitVote,
    hasVoted,
    checkPollPassword,
    isPollPrivate,
    filterPollsByDateRange
  };
};
