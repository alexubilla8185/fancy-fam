import { CardData } from '../types';

export const generateVCard = (cardData: CardData): string => {
  const { name, title, email, phone, website, profilePicture, profilePictureUrl, socialLinks, funFacts } = cardData;

  const formatNote = (text: string) => {
    return text.replace(/\n/g, '\\n');
  };

  let vCard = 'BEGIN:VCARD\n';
  vCard += 'VERSION:3.0\n';
  vCard += `FN:${name}\n`;
  vCard += `N:${name.split(' ').slice(1).join(' ')};${name.split(' ')[0]};;;\n`;
  if (title) vCard += `TITLE:${title}\n`;
  if (email) vCard += `EMAIL;type=INTERNET,PREF:${email}\n`;
  if (phone) vCard += `TEL;type=CELL,VOICE:${phone}\n`;
  if (website) vCard += `URL:${website}\n`;
  
  if (profilePictureUrl) {
    vCard += `PHOTO;VALUE=URI:${profilePictureUrl}\n`;
  } else if (profilePicture) {
    vCard += `PHOTO;ENCODING=b;TYPE=WEBP:${profilePicture}\n`;
  }

  socialLinks.forEach(link => {
    if(link.url) {
        vCard += `item${link.id}.URL;type=${link.type}:${link.url}\nitem${link.id}.X-ABLabel:${link.type}\n`;
    }
  });

  if (funFacts.length > 0) {
    let notes = 'Fun Facts:\\n';
    funFacts.forEach(fact => {
      if(fact.answer) notes += `Q: ${fact.question}\\nA: ${fact.answer}\\n\\n`;
    });
    if (notes !== 'Fun Facts:\\n') vCard += `NOTE:${formatNote(notes)}\n`;
  }
  
  vCard += `REV:${new Date().toISOString()}\n`;
  vCard += 'END:VCARD';
  return vCard;
};

export const downloadVCard = (cardData: CardData) => {
    const vCardString = generateVCard(cardData);
    const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.name.replace(/\s/g, '_')}_FancyFam.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};