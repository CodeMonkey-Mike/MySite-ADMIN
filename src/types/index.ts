import { UploadProps } from 'antd/lib/upload';
import { BlogStatus } from 'src/interfaces';

export interface UserInformationTypes {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role_id?: number;
  profile_picture?: string;
}

export interface UserSubmissionTypes {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface IAboutMe {
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  birthPlace?: string;
  web?: string;
  hobbies?: string;
  address?: string;
  address_1?: string;
  bio?: string;
}

export interface IVideo {
  title?: string;
  url?: string;
}

export interface Item {
  id: number;
  name?: string;
}

export interface ISkillItem extends Item {
  index?: number;
  strength: number;
  sequence?: number;
}

export interface IEduItem extends Item {
  index?: number;
  degree: string;
  description: string;
  location: string;
  school: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  timePeriod?: any[];
}

export interface IExpItem extends Item {
  index?: number;
  title: string;
  description: string;
  website: string;
  website_url: string;
  company: string;
  hide: boolean | null;
  current: boolean;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  start?: any;
  end?: any;
  sequence?: number;
}

export interface IProcessItem extends Item {
  icon: string;
}

export interface IChannelItem extends Item {
  url: string;
  icon: string;
  visible: boolean;
}

export interface IServiceItem extends Item {
  file?: File;
  image?: string;
}

export interface IAwardItem extends Item {
  file?: File;
  image?: string;
  title: string;
  company: string;
  awardTime: string;
}

export interface IServiceItem extends Item {
  url: string;
  parent_id: number;
  category: string;
}

export interface IPortfolioItem extends Item {
  index?: number;
  file?: File;
  gallery?: File[];
  type: string;
  logo: string | UploadProps;
  client: string;
  description: string;
  category: string;
  url: string;
  year: string;
  detail: string;
  facebook?: string;
  twitter?: string;
  pinterest?: string;
  linkedin?: string;
}

export interface ITestimonialItem extends Item {
  company: string;
  quote: string;
}

export interface INewsletterItem extends Item {
  email: string;
  topics: string;
}

export interface IYoutubeItem extends Item {
  title: string;
  code: string;
  url: string;
}

export interface IBlogItem extends Item {
  title: string;
  content: string;
  image: string;
  status: BlogStatus;
  category: string;
  tags: string[];
}

export interface ITopicItem extends Item {
  title: string;
}

export interface IPollItem extends Item {
  title: string;
  topic: string;
  category: string;
  options: string;
  created_at: string;
}

export interface ICarouselItem extends Item {
  title: string;
  created_at: string;
}

export interface ICarouselSlideItem extends Item {
  description: string;
  hashtag: string;
  sequence: string;
  carousel_id: number;
  created_at: string;
}

export interface ICarouselTopicItem extends Item {
  topic: string;
  content: string;
  created_at?: string;
}
