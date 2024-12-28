import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import pdf from 'pdf-parse';

export async function fetchCourseData() {
  try {
    // Example URL - replace with actual RVCE website URL
    const url = 'https://rvce.edu.in/courses';
    
    // Using Puppeteer for dynamic content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Example selectors - update based on actual website structure
    const courses = [];
    
    $('.course-item').each((i, el) => {
      courses.push({
        code: $(el).find('.course-code').text(),
        name: $(el).find('.course-name').text(),
        faculty: $(el).find('.faculty-name').text(),
        email: $(el).find('.faculty-email').text(),
        phone: $(el).find('.faculty-phone').text(),
      });
    });

    await browser.close();
    return courses;
    
  } catch (error) {
    console.error('Error fetching course data:', error);
    throw error;
  }
}

export async function fetchTimetableData(pdfUrl) {
  try {
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const data = await pdf(response.data);
    
    // Parse PDF content and extract timetable
    // This will need custom logic based on PDF structure
    return parseTimetableFromText(data.text);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    throw error;
  }
}

function parseTimetableFromText(text) {
  // Custom parsing logic for timetable PDF
  // This will need to be implemented based on the actual PDF structure
} 