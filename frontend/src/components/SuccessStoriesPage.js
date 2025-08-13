import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ReadMore as ReadMoreIcon,
  Star as StarIcon,
  Accessible as AccessibleIcon,
  SportsEsports as SportsIcon,
  Business as BusinessIcon,
  School as EducationIcon,
  Work as WorkIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for success stories
const successStories = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "From Helpless to Paralympic Champion",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
    summary: "Found hope through Divyang-Setu platform, connected with sports mentors and training facilities, now inspiring millions as India's first Paralympic swimming champion.",
    fullStory: "Priya Sharma was born with a congenital limb difference and spent her early years feeling isolated and helpless. Her family struggled to find proper support and resources. Through Divyang-Setu, Priya connected with specialized swimming coaches, accessible training facilities, and a supportive community of athletes with disabilities. The platform helped her access government sports schemes and connect with mentors who believed in her potential. Today, she's not just a Paralympic gold medalist but also runs swimming academies for children with disabilities, helping them find the same hope and support she discovered through the platform.",
    achievements: ["Paralympic Gold Medal 2020", "National Sports Award 2021", "UNESCO Sports Champion 2022"],
    tags: ["Sports", "Swimming", "Platform Success"]
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    title: "Blind Entrepreneur's Tech Revolution",
    category: "Business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    summary: "Divyang-Setu connected him with business mentors and funding opportunities, now runs a successful tech startup employing 50+ people with disabilities.",
    fullStory: "Rajesh Kumar, who is visually impaired, was struggling to find employment and support for his business ideas. Through Divyang-Setu, he connected with business mentors, accessed government startup schemes, and found investors who believed in his vision. The platform helped him navigate the complex process of starting a business as a person with disabilities. His company 'AccessTech' now develops innovative assistive technology solutions and employs over 50 people, including many with disabilities. Rajesh credits Divyang-Setu for transforming his life from a struggling job seeker to a successful entrepreneur.",
    achievements: ["Forbes 30 Under 30", "National Innovation Award", "Social Enterprise of the Year"],
    tags: ["Technology", "Entrepreneurship", "Platform Success"]
  },
  {
    id: 3,
    name: "Anjali Patel",
    title: "Cerebral Palsy to PhD Success",
    category: "Education",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    summary: "Divyang-Setu helped her access educational resources and connect with inclusive institutions, now advocating for inclusive education policies nationwide.",
    fullStory: "Anjali Patel faced severe discrimination and lack of accessibility in educational institutions due to her cerebral palsy. Through Divyang-Setu, she discovered government educational schemes for persons with disabilities, connected with inclusive universities, and found mentors who supported her academic journey. The platform helped her access assistive technology, note-taking services, and transportation support. Today, she's not just the first person with cerebral palsy to earn a PhD in India, but also works as a consultant helping educational institutions implement inclusive practices, ensuring others don't face the same barriers she overcame.",
    achievements: ["PhD in Education Policy", "National Education Award", "UNESCO Fellowship"],
    tags: ["Education", "Advocacy", "Platform Success"]
  },
  {
    id: 4,
    name: "Amit Singh",
    title: "Hearing Impaired Chef's Culinary Dream",
    category: "Business",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    summary: "Divyang-Setu connected him with culinary training programs and business mentors, now runs multiple successful restaurants with inclusive hiring practices.",
    fullStory: "Amit Singh, who is hearing impaired, dreamed of becoming a chef but faced numerous barriers in accessing culinary education and employment. Through Divyang-Setu, he discovered specialized culinary training programs for persons with disabilities, connected with mentors in the food industry, and accessed government business schemes. The platform helped him find inclusive workplaces and learn about accessibility requirements for restaurants. Today, he runs multiple successful restaurants known for their inclusive hiring practices and accessibility features, proving that disabilities don't limit culinary excellence.",
    achievements: ["Best Chef Award 2021", "Restaurant of the Year", "Inclusive Business Award"],
    tags: ["Culinary", "Restaurant", "Platform Success"]
  },
  {
    id: 5,
    name: "Meera Iyer",
    title: "Wheelchair User's Fashion Empire",
    category: "Business",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    summary: "Divyang-Setu helped her access business training and connect with fashion industry mentors, now runs an internationally recognized inclusive fashion brand.",
    fullStory: "Meera Iyer, who uses a wheelchair, struggled to find fashionable and functional clothing for people with disabilities. Through Divyang-Setu, she connected with fashion industry mentors, accessed business development programs, and learned about inclusive design principles. The platform helped her understand market needs and connect with suppliers who could accommodate her requirements. Her brand 'Inclusive Fashion' now creates stylish, accessible clothing with features like magnetic closures and adjustable fits, gaining international recognition and helping thousands of people with disabilities feel confident and stylish.",
    achievements: ["Fashion Designer of the Year", "Inclusive Design Award", "International Recognition"],
    tags: ["Fashion", "Design", "Platform Success"]
  },
  {
    id: 6,
    name: "Suresh Reddy",
    title: "Blind Developer's Accessibility Mission",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    summary: "Divyang-Setu connected him with tech training programs and accessibility experts, now develops inclusive digital solutions for major tech companies.",
    fullStory: "Suresh Reddy, who is blind, faced significant challenges breaking into the tech industry due to lack of accessible training and workplace accommodations. Through Divyang-Setu, he discovered specialized tech training programs for persons with disabilities, connected with accessibility experts, and accessed government employment schemes. The platform helped him find inclusive workplaces and learn about assistive technologies. Today, he specializes in developing accessibility features and has worked with major tech companies to make their products more inclusive, ensuring that digital technology serves everyone, regardless of their abilities.",
    achievements: ["Accessibility Innovation Award", "Tech Leader of the Year", "Google Developer Award"],
    tags: ["Technology", "Accessibility", "Platform Success"]
  }
];

const categories = [
  { label: "All", value: "all", icon: <StarIcon /> },
  { label: "Sports", value: "sports", icon: <SportsIcon /> },
  { label: "Business", value: "business", icon: <BusinessIcon /> },
  { label: "Education", value: "education", icon: <EducationIcon /> },
  { label: "Technology", value: "technology", icon: <WorkIcon /> }
];

const SuccessStoryCard = ({ story, onReadMore }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      style={{ height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            transform: 'translateY(-8px)',
          }
        }}
      >
        {/* Header Section with Avatar and Category */}
        <Box sx={{ 
          position: 'relative', 
          p: 3, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Avatar
            src={story.image}
            alt={story.name}
            sx={{ 
              width: 90, 
              height: 90, 
              mx: 'auto', 
              mb: 2,
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
          <Chip 
            label={story.category} 
            color="primary" 
            size="small" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        </Box>
        
        {/* Content Section */}
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 3,
          '&:last-child': { pb: 3 }
        }}>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            {story.name}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="primary" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              fontSize: '0.95rem',
              lineHeight: 1.4
            }}
          >
            {story.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              flexGrow: 1, 
              mb: 3,
              lineHeight: 1.6,
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {story.summary}
          </Typography>
          
          {/* Action Button */}
          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ReadMoreIcon />}
              onClick={() => onReadMore(story)}
              fullWidth
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                }
              }}
            >
              Read More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SuccessStoryModal = ({ open, story, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!story) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: fullScreen ? '100%' : '90%'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={story.image}
            alt={story.name}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {story.name}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              {story.title}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Story
          </Typography>
          <Typography variant="body1" paragraph>
            {story.fullStory}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Key Achievements
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {story.achievements.map((achievement, index) => (
              <Chip
                key={index}
                label={achievement}
                color="secondary"
                variant="outlined"
                icon={<StarIcon />}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {story.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SuccessStoriesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredStories = successStories.filter(story => {
    const matchesSearch = story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || story.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (story) => {
    setSelectedStory(story);
  };

  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        p: 4,
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2563eb, #10b981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Community Success Stories
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Be inspired by the journeys of individuals overcoming challenges and making an impact.
          </Typography>
        </motion.div>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ 
        mb: 5,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search success stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              {categories.map((category) => (
                <Chip
                  key={category.value}
                  label={category.label}
                  icon={category.icon}
                  onClick={() => setSelectedCategory(category.value)}
                  color={selectedCategory === category.value ? 'primary' : 'default'}
                  variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Success Stories Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(2, 1fr)'
        },
        gap: { xs: 2, sm: 3, md: 3, lg: 4 },
        alignItems: 'stretch'
      }}>
        <AnimatePresence>
          {filteredStories.map((story, index) => (
            <Box key={story.id} sx={{ 
              display: 'flex',
              minHeight: { xs: 'auto', sm: '500px', md: '520px', lg: '540px' }
            }}>
              <SuccessStoryCard 
                story={story} 
                onReadMore={handleReadMore}
              />
            </Box>
          ))}
        </AnimatePresence>
      </Box>

      {/* No Results Message */}
      {filteredStories.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No success stories found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Success Story Modal */}
      <SuccessStoryModal
        open={Boolean(selectedStory)}
        story={selectedStory}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default SuccessStoriesPage;

