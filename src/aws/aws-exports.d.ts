declare module '../aws/aws-exports' {
  const awsConfig: {
    aws_project_region: string;
    aws_cognito_region: string;
    aws_user_pools_id: string;
    aws_user_pools_web_client_id: string;
  };

  export default awsConfig;
} 