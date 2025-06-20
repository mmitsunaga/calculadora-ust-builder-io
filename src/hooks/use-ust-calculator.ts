import { useState, useCallback, useMemo } from "react";
import {
  USTCalculatorData,
  PersonalInfo,
  ConfigurationParams,
  ProfessionalProfile,
  Project,
  SquadMember,
  ProjectComplexity,
  createInitialUSTCalculatorData,
  calculateProjectDurationByComplexity,
  updateSquadMemberCalculations,
  generateId,
} from "@/lib/ust-calculator";

export const useUSTCalculator = () => {
  const [data, setData] = useState<USTCalculatorData>(
    createInitialUSTCalculatorData(),
  );

  // Navigation functions
  const setCurrentStep = useCallback((step: number) => {
    setData((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setData((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setData((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // Personal Info functions
  const updatePersonalInfo = useCallback((personalInfo: PersonalInfo) => {
    setData((prev) => ({ ...prev, personalInfo }));
  }, []);

  // Configuration functions
  const updateConfiguration = useCallback(
    (configuration: ConfigurationParams) => {
      setData((prev) => {
        const newData = { ...prev, configuration };

        // Recalculate all squad member calculations when configuration changes
        const recalculatedSquads = {
          low: {
            ...newData.squads.low,
            members: newData.squads.low.members.map((member) =>
              updateSquadMemberCalculations(
                member,
                configuration,
                newData.squads.low.totalDurationWeeks,
              ),
            ),
          },
          medium: {
            ...newData.squads.medium,
            members: newData.squads.medium.members.map((member) =>
              updateSquadMemberCalculations(
                member,
                configuration,
                newData.squads.medium.totalDurationWeeks,
              ),
            ),
          },
          high: {
            ...newData.squads.high,
            members: newData.squads.high.members.map((member) =>
              updateSquadMemberCalculations(
                member,
                configuration,
                newData.squads.high.totalDurationWeeks,
              ),
            ),
          },
        };

        return { ...newData, squads: recalculatedSquads };
      });
    },
    [],
  );

  // Professional Profiles functions
  const addProfessionalProfile = useCallback(
    (profile: Omit<ProfessionalProfile, "id">) => {
      const newProfile: ProfessionalProfile = {
        ...profile,
        id: generateId(),
      };
      setData((prev) => ({
        ...prev,
        professionalProfiles: [...prev.professionalProfiles, newProfile],
      }));
      return newProfile;
    },
    [],
  );

  const updateProfessionalProfile = useCallback(
    (id: string, updates: Partial<ProfessionalProfile>) => {
      setData((prev) => ({
        ...prev,
        professionalProfiles: prev.professionalProfiles.map((profile) =>
          profile.id === id ? { ...profile, ...updates } : profile,
        ),
      }));
    },
    [],
  );

  const deleteProfessionalProfile = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      professionalProfiles: prev.professionalProfiles.filter(
        (profile) => profile.id !== id,
      ),
    }));
  }, []);

  // Project functions
  const addProject = useCallback((project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
    };
    setData((prev) => {
      const newProjects = [...prev.projects, newProject];
      const durationByComplexity =
        calculateProjectDurationByComplexity(newProjects);

      // Update squad total durations
      const updatedSquads = {
        low: {
          ...prev.squads.low,
          totalDurationWeeks: durationByComplexity.low,
        },
        medium: {
          ...prev.squads.medium,
          totalDurationWeeks: durationByComplexity.medium,
        },
        high: {
          ...prev.squads.high,
          totalDurationWeeks: durationByComplexity.high,
        },
      };

      // Recalculate squad member totals with new durations
      const recalculatedSquads = {
        low: {
          ...updatedSquads.low,
          members: updatedSquads.low.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.low,
            ),
          ),
        },
        medium: {
          ...updatedSquads.medium,
          members: updatedSquads.medium.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.medium,
            ),
          ),
        },
        high: {
          ...updatedSquads.high,
          members: updatedSquads.high.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.high,
            ),
          ),
        },
      };

      return {
        ...prev,
        projects: newProjects,
        squads: recalculatedSquads,
      };
    });
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setData((prev) => {
      const updatedProjects = prev.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      );
      const durationByComplexity =
        calculateProjectDurationByComplexity(updatedProjects);

      // Update squad total durations and recalculate
      const recalculatedSquads = {
        low: {
          ...prev.squads.low,
          totalDurationWeeks: durationByComplexity.low,
          members: prev.squads.low.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.low,
            ),
          ),
        },
        medium: {
          ...prev.squads.medium,
          totalDurationWeeks: durationByComplexity.medium,
          members: prev.squads.medium.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.medium,
            ),
          ),
        },
        high: {
          ...prev.squads.high,
          totalDurationWeeks: durationByComplexity.high,
          members: prev.squads.high.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.high,
            ),
          ),
        },
      };

      return {
        ...prev,
        projects: updatedProjects,
        squads: recalculatedSquads,
      };
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((prev) => {
      const updatedProjects = prev.projects.filter(
        (project) => project.id !== id,
      );
      const durationByComplexity =
        calculateProjectDurationByComplexity(updatedProjects);

      // Update squad total durations and recalculate
      const recalculatedSquads = {
        low: {
          ...prev.squads.low,
          totalDurationWeeks: durationByComplexity.low,
          members: prev.squads.low.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.low,
            ),
          ),
        },
        medium: {
          ...prev.squads.medium,
          totalDurationWeeks: durationByComplexity.medium,
          members: prev.squads.medium.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.medium,
            ),
          ),
        },
        high: {
          ...prev.squads.high,
          totalDurationWeeks: durationByComplexity.high,
          members: prev.squads.high.members.map((member) =>
            updateSquadMemberCalculations(
              member,
              prev.configuration,
              durationByComplexity.high,
            ),
          ),
        },
      };

      return {
        ...prev,
        projects: updatedProjects,
        squads: recalculatedSquads,
      };
    });
  }, []);

  // Squad functions
  const updateSquadMemberQuantity = useCallback(
    (complexity: ProjectComplexity, profileId: string, quantity: number) => {
      setData((prev) => {
        const squad = prev.squads[complexity];
        const updatedMembers = squad.members.map((member) =>
          member.profileId === profileId
            ? updateSquadMemberCalculations(
                { ...member, quantity },
                prev.configuration,
                squad.totalDurationWeeks,
              )
            : member,
        );

        return {
          ...prev,
          squads: {
            ...prev.squads,
            [complexity]: {
              ...squad,
              members: updatedMembers,
            },
          },
        };
      });
    },
    [],
  );

  const initializeSquadMembers = useCallback(() => {
    setData((prev) => {
      const durationByComplexity = calculateProjectDurationByComplexity(
        prev.projects,
      );

      const createSquadMembers = (complexity: ProjectComplexity) =>
        prev.professionalProfiles.map((profile) =>
          updateSquadMemberCalculations(
            {
              profileId: profile.id,
              profileName: profile.profileName,
              fcp: profile.fcp,
              quantity: 0,
            },
            prev.configuration,
            durationByComplexity[complexity],
          ),
        );

      return {
        ...prev,
        squads: {
          low: {
            complexity: "low" as const,
            totalDurationWeeks: durationByComplexity.low,
            members: createSquadMembers("low"),
          },
          medium: {
            complexity: "medium" as const,
            totalDurationWeeks: durationByComplexity.medium,
            members: createSquadMembers("medium"),
          },
          high: {
            complexity: "high" as const,
            totalDurationWeeks: durationByComplexity.high,
            members: createSquadMembers("high"),
          },
        },
      };
    });
  }, []);

  // Computed values
  const totalProjects = useMemo(() => data.projects.length, [data.projects]);

  const totalProjectDuration = useMemo(
    () =>
      data.projects.reduce((sum, project) => sum + project.durationWeeks, 0),
    [data.projects],
  );

  const projectsByComplexity = useMemo(
    () => calculateProjectDurationByComplexity(data.projects),
    [data.projects],
  );

  const canProceedToNextStep = useMemo(() => {
    switch (data.currentStep) {
      case 1:
        return (
          data.personalInfo.fullName.trim() !== "" &&
          data.personalInfo.email.trim() !== "" &&
          data.personalInfo.organization.trim() !== ""
        );
      case 2:
        return data.professionalProfiles.length > 0;
      case 3:
        return true; // Projects are optional
      case 4:
        return true; // Squad configuration is optional
      case 5:
        return true;
      default:
        return false;
    }
  }, [data]);

  const reset = useCallback(() => {
    setData(createInitialUSTCalculatorData());
  }, []);

  return {
    // State
    data,

    // Navigation
    setCurrentStep,
    nextStep,
    previousStep,
    canProceedToNextStep,

    // Personal Info
    updatePersonalInfo,

    // Configuration
    updateConfiguration,

    // Professional Profiles
    addProfessionalProfile,
    updateProfessionalProfile,
    deleteProfessionalProfile,

    // Projects
    addProject,
    updateProject,
    deleteProject,

    // Squads
    updateSquadMemberQuantity,
    initializeSquadMembers,

    // Computed values
    totalProjects,
    totalProjectDuration,
    projectsByComplexity,

    // Utilities
    reset,
  };
};
