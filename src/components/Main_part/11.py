class SENet(nn.Module):
    def __init__(self, num_classes=1000):
        super(SENet, self).__init__()
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU()
        self.se_block1 = SENetResNetBlock(64, 128)
        self.fc = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.se_block1(x)
        x = torch.mean(x, dim=[2, 3])  # 全局平均池化
        x = self.fc(x)
        return x
