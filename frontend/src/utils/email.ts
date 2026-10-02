export const openGmailCompose = ({
  to,
  subject = 'Portfolio Inquiry',
  body = 'Hello Aditya,\n\nI came across your portfolio and would like to connect regarding a potential opportunity.\n\nBest regards,\n[Your Name]',
}: {
  to: string;
  subject?: string;
  body?: string;
}) => {
  const url = new URL('https://mail.google.com/mail/');
  url.searchParams.set('view', 'cm');
  url.searchParams.set('fs', '1');
  url.searchParams.set('to', to);
  url.searchParams.set('su', subject);
  url.searchParams.set('body', body);

  const gmailWindow = window.open(url.toString(), 'gmail_compose');
  if (gmailWindow) {
    gmailWindow.focus();
  }
};
