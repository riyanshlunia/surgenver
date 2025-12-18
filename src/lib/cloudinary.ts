export const generateCertificateUrl = (
  templatePublicId: string,
  participantName: string,
  x: number,
  y: number,
  fontSize: number = 50,
  fontFamily: string = 'Roboto',
  fontColor: string = '000000'
) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Encode the participant name for URL
  const encodedName = encodeURIComponent(participantName);
  
  // Construct the transformation URL
  const transformations = [
    `l_text:${fontFamily}_${fontSize}_bold:${encodedName}`,
    `g_north_west`,
    `x_${x}`,
    `y_${y}`,
    `co_rgb:${fontColor}`
  ].join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${templatePublicId}`;
};

export const getDownloadUrl = (certificateUrl: string) => {
  return certificateUrl.replace('/upload/', '/upload/fl_attachment/');
};
