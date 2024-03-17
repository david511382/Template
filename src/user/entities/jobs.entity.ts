import { JobEnum } from '../enum/job.enum';

export class Jobs {
  public static readonly LIST: (readonly [string, JobEnum])[] = [
    ['Software Developer', JobEnum.SoftwareDeveloper],
    ['Project Manager', JobEnum.ProjectManager],
    ['Sales Representative', JobEnum.SalesRepresentative],
    ['Accountant', JobEnum.Accountant],
    ['Graphic Designer', JobEnum.GraphicDesigner],
    ['Teacher', JobEnum.Teacher],
    ['Nurse', JobEnum.Nurse],
    ['Engineer', JobEnum.Engineer],
    ['Marketing Specialist', JobEnum.MarketingSpecialist],
    ['Administrative Assistant', JobEnum.AdministrativeAssistant],
    ['Data Analyst', JobEnum.DataAnalyst],
    ['Financial Analyst', JobEnum.FinancialAnalyst],
    ['Human Resources Manager', JobEnum.HumanResourcesManager],
    ['Web Designer', JobEnum.WebDesigner],
    ['Product Manager', JobEnum.ProductManager],
    ['Customer Service Representative', JobEnum.CustomerServiceRepresentative],
    ['Business Analyst', JobEnum.BusinessAnalyst],
    ['Architect', JobEnum.Architect],
    ['Lawyer', JobEnum.Lawyer],
    ['Chef', JobEnum.Chef],
    ['Product manager/Owner', JobEnum.ProductManagerOwner],
    ['Program/Project manager', JobEnum.ProgramProjectManager],
    ['Engineer/Developer', JobEnum.EngineerDeveloper],
    ['Scrum master/Agile coach', JobEnum.ScrumMasterAgileCoach],
    ['UX researcher/Designer', JobEnum.UXResearcherDesigner],
    ['Designer', JobEnum.Designer],
    ['PR/Communications', JobEnum.PRCommunications],
    ['Operations', JobEnum.Operations],
    ['Sales/Success', JobEnum.SalesSuccess],
    ['Teacher/Professor', JobEnum.TeacherProfessor],
    ['Student', JobEnum.Student],
    ['Analyst/Data Scientist', JobEnum.AnalystDataScientist],
    ['HR/People', JobEnum.HRPeople],
    ['Writer/Editor', JobEnum.WriterEditor],
    ['Strategist/Consultant', JobEnum.StrategistConsultant],
    ['Team/Department leader', JobEnum.TeamDepartmentLeader],
    ['Other', JobEnum.Other],
  ];

  private static readonly jobMap: Map<string, string> = new Map(Jobs.LIST);

  static get(): Map<string, string> {
    return this.jobMap;
  }
}
